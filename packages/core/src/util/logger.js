import configManager from '../config/configManager';

export function logDebug(message) {
  if (configManager.getConfig().loggerLevel === 'debug') {
    console.log(message);    
  }
}
