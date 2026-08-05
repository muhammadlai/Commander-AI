import { useState, useEffect, useCallback } from 'react';
import { UserSettings, Project, ActivityLog, SystemMetrics, ThemeMode, AccentColor, AppLanguage, FontSize, AnimationSpeed } from '../types';
import { apiService } from '../services/apiService';
import { applyTheme, applyAccentColor } from '../utils/theme';

export function useCommander() {
  const [settings, setSettings] = useState<UserSettings>({
    id: 'sett_01',
    userId: 'usr_architect_01',
    theme: 'dark',
    accentColor: 'cyan',
    language: 'en',
    fontSize: 'medium',
    animationSpeed: 'normal',
    showAvatar: true,
    enableVoice: true,
    emailNotifications: true,
    pushNotifications: true,
    securityAlerts: true,
    desktopNotifications: true,
    soundEffects: true,
    autoSave: true,
    debugMode: false,
    
    aiProvider: 'gemini',
    geminiModel: 'gemini-3.6-flash',
    openaiModel: 'gpt-4o-mini',
    anthropicModel: 'claude-3-5-sonnet-20241022',
    temperature: 0.7,
    maxTokens: 2048,
    streamingEnabled: true,
    aiPersonality: 'Executive CEO',
    responseLength: 'Balanced',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 3,
    memoryUsage: 172,
    activeSessions: 1,
    systemStatus: 'Operational',
    uptimeSeconds: 3600,
    version: '1.1.0-alpha',
  });

  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isCommanderNoticeOpen, setIsCommanderNoticeOpen] = useState(false);

  // Load initial settings
  const loadSettings = useCallback(async () => {
    try {
      const data = await apiService.getSettings();
      if (data) {
        setSettings(data);
        applyTheme(data.theme);
        applyAccentColor(data.accentColor);
      }
    } catch (err) {
      console.warn('Fallback settings used:', err);
      applyTheme(settings.theme);
      applyAccentColor(settings.accentColor);
    }
  }, [settings.theme, settings.accentColor]);

  // Load projects & logs
  const loadData = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const [projData, logData, sysData] = await Promise.all([
        apiService.getProjects(),
        apiService.getActivityLogs(),
        apiService.getSystemStatus(),
      ]);
      setProjects(projData);
      setActivityLogs(logData);
      setMetrics(sysData);
    } catch (err) {
      console.warn('Failed loading data from server:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    loadData();
  }, [loadSettings, loadData]);

  const updateTheme = async (theme: ThemeMode) => {
    setSettings(prev => ({ ...prev, theme }));
    applyTheme(theme);
    try {
      await apiService.updateSettings({ theme });
    } catch (err) {
      console.error(err);
    }
  };

  const updateAccent = async (accentColor: AccentColor) => {
    setSettings(prev => ({ ...prev, accentColor }));
    applyAccentColor(accentColor);
    try {
      await apiService.updateSettings({ accentColor });
    } catch (err) {
      console.error(err);
    }
  };

  const updateLanguage = async (language: AppLanguage) => {
    setSettings(prev => ({ ...prev, language }));
    try {
      await apiService.updateSettings({ language });
    } catch (err) {
      console.error(err);
    }
  };

  const updateFontSize = async (fontSize: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize }));
    try {
      await apiService.updateSettings({ fontSize });
    } catch (err) {
      console.error(err);
    }
  };

  const updateAnimationSpeed = async (animationSpeed: AnimationSpeed) => {
    setSettings(prev => ({ ...prev, animationSpeed }));
    try {
      await apiService.updateSettings({ animationSpeed });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSettingBool = async (key: 'showAvatar' | 'enableVoice' | 'emailNotifications' | 'pushNotifications' | 'securityAlerts' | 'desktopNotifications' | 'soundEffects' | 'autoSave' | 'debugMode') => {
    const updatedValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: updatedValue }));
    try {
      await apiService.updateSettings({ [key]: updatedValue });
    } catch (err) {
      console.error(err);
    }
  };

  const createProject = async (projectData: Partial<Project>) => {
    try {
      const newProj = await apiService.createProject(projectData);
      setProjects(prev => [newProj, ...prev]);
      // Refresh logs
      const logData = await apiService.getActivityLogs();
      setActivityLogs(logData);
      return newProj;
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await apiService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      const logData = await apiService.getActivityLogs();
      setActivityLogs(logData);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const openCommanderNotice = () => {
    setIsCommanderNoticeOpen(true);
    apiService.logActivity('Attempted Commander Engine Launch', 'system', 'Displayed Phase 1.2 activation notice');
  };

  const updateAiSettings = async (partialSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partialSettings }));
    try {
      await apiService.updateSettings(partialSettings);
    } catch (err) {
      console.error('Failed to update AI settings:', err);
    }
  };

  return {
    settings,
    projects,
    activityLogs,
    metrics,
    isLoadingProjects,
    isCommanderNoticeOpen,
    setIsCommanderNoticeOpen,
    openCommanderNotice,
    updateTheme,
    updateAccent,
    updateLanguage,
    updateFontSize,
    updateAnimationSpeed,
    updateAiSettings,
    toggleSettingBool,
    toggleNotificationSetting: toggleSettingBool,
    createProject,
    deleteProject,
    refreshData: loadData,
  };
}
