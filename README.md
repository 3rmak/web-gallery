Manual with access from internet: 
1. setup portmap environment;
2. open firewall port for app;
3. create '.env' file with your external credentials using '.env_sample' as a template
4. npm run start shared_folders='C:\001_folder;C:\002_folder'

Manual for LAN-usage:
1. open firewall port for app;
2. create '.env_local' file with your external credentials using '.env_sample' as a template
3. npm run start:local shared_folders='C:\001_folder;C:\002_folder'

Access from external ip-s was implemented through https://portmap.io/ service
