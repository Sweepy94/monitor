# L4 DDoS Monitor

Système de surveillance en temps réel du trafic réseau pour la détection des attaques DDoS de niveau 4, avec analyse des paquets et visualisation interactive.

## Présentation

L4 DDoS Monitor est une solution complète pour surveiller le trafic réseau, spécialement conçue pour détecter et analyser les potentielles attaques DDoS au niveau de la couche transport (L4). Le système capture et traite les paquets réseau en temps réel, offrant une visibilité immédiate sur les modèles de trafic, les anomalies et l'état des connexions.

## Prérequis

- Système d'exploitation :
  - Debian 12 ou Ubuntu 22.04 (ou version supérieure)
  - Droits root/sudo pour la capture de paquets
- Node.js version 22.15.0 ou supérieure
- Matériel :
  - Minimum 1 Go de RAM
  - 2 Go d'espace disque

## Installation

### 1. Téléchargement et décompression

1. Téléchargez l'archive `.zip` du projet
2. Décompressez l'archive dans un dossier de votre choix :
   ```bash
   unzip l4-ddos-monitor.zip
   ```
   ou utilisez l'explorateur de fichiers pour extraire l'archive

### 2. Installation automatique (Recommandée)

1. Ouvrez un terminal dans le dossier du projet
2. Rendez le script d'installation exécutable :
   ```bash
   chmod +x install.sh
   ```
3. Lancez l'installation en tant que root :
   ```bash
   sudo ./install.sh
   ```

Le script va :
- Installer les dépendances système nécessaires
- Configurer l'environnement
- Créer et démarrer les services
- Construire l'interface web

### 3. Accès à l'interface

Une fois l'installation terminée, accédez à l'interface via :
```
http://localhost:3000
```

## Utilisation

### Démarrage manuel des services

Si vous devez redémarrer les services manuellement :

1. Service de monitoring :
   ```bash
   sudo systemctl start l4-ddos-monitor
   ```

2. Interface web :
   ```bash
   sudo systemctl start l4-ddos-web
   ```

### Vérification de l'état des services

```bash
sudo systemctl status l4-ddos-monitor
sudo systemctl status l4-ddos-web
```

### Consultation des logs

- Logs système :
  ```bash
  sudo journalctl -u l4-ddos-monitor
  sudo journalctl -u l4-ddos-web
  ```
- Logs Apache :
  ```bash
  sudo tail -f /var/log/apache2/l4-ddos-error.log
  ```

## Dépannage

### Le service ne démarre pas

1. Vérifiez les droits d'exécution :
   ```bash
   sudo chmod +x /opt/l4-ddos-monitor/backend/monitor.js
   ```

2. Vérifiez les dépendances Node.js :
   ```bash
   cd /opt/l4-ddos-monitor
   npm install
   ```

3. Vérifiez les permissions tcpdump :
   ```bash
   sudo chmod u+s $(which tcpdump)
   ```

### Erreurs de connexion à l'interface web

1. Vérifiez que les services sont actifs :
   ```bash
   sudo systemctl status l4-ddos-monitor
   sudo systemctl status l4-ddos-web
   ```

2. Vérifiez la configuration Apache :
   ```bash
   sudo apache2ctl -t
   ```

3. Redémarrez les services :
   ```bash
   sudo systemctl restart l4-ddos-monitor
   sudo systemctl restart l4-ddos-web
   sudo systemctl restart apache2
   ```

### Base de données inaccessible

1. Vérifiez les permissions du dossier data :
   ```bash
   sudo chown -R root:root /opt/l4-ddos-monitor/data
   sudo chmod 755 /opt/l4-ddos-monitor/data
   ```

2. Réinitialisez la base de données :
   ```bash
   cd /opt/l4-ddos-monitor
   node install.js
   ```

## Maintenance

### Mise à jour du système

```bash
cd /opt/l4-ddos-monitor
git pull
npm install
sudo systemctl restart l4-ddos-monitor
sudo systemctl restart l4-ddos-web
```

### Sauvegarde

Pour sauvegarder les données :
```bash
sudo cp -r /opt/l4-ddos-monitor/data /backup/l4-ddos-$(date +%Y%m%d)
```

## Support

En cas de problème persistant :
1. Consultez les logs détaillés
2. Vérifiez la configuration système
3. Redémarrez les services concernés
4. Ouvrez une issue sur le dépôt du projet avec les logs et détails du problème