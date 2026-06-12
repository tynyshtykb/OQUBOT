; =====================================================================
; Скрипт сборки установщика OquBot IDE для Inno Setup
; Разработчик: BEKTAY (Исправленный)
; =====================================================================

[Setup]
; ИСПРАВЛЕНО: Добавлена закрывающая двойная скобка }}
AppId={{A1B2C3D4-E5F6-7A8B-9C0D-E1F2A3B4C5D6}}
AppName=OquBot IDE
AppVersion=1.0
AppPublisher=OquBot Robotics
DefaultDirName={autopf}\OquBot IDE
DefaultGroupName=OquBot IDE
LicenseFile=rules.txt
OutputBaseFilename=OquBot_Setup_v1.0
OutputDir=Output
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=admin
SetupIconFile=logo.ico

[Languages]
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"
Name: "install_driver"; Description: "Установить драйвер CH340 (необходим для подключения робота через USB)"; GroupDescription: "Дополнительное программное обеспечение:"

[Files]
Source: "dist\main2.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "block_programming\*"; DestDir: "{app}\block_programming"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "apikeys.env"; DestDir: "{app}"; Flags: ignoreversion
Source: "rules.txt"; DestDir: "{app}"; Flags: ignoreversion
Source: "CH340_setup.exe"; DestDir: "{tmp}"; Flags: deleteafterinstall

[Icons]
; ИСПРАВЛЕНО: Добавлен параметр WorkingDir, чтобы ярлык знал, где искать файлы окружения
Name: "{group}\OquBot IDE"; Filename: "{app}\main2.exe"; WorkingDir: "{app}"
Name: "{autodesktop}\OquBot IDE"; Filename: "{app}\main2.exe"; Tasks: desktopicon; WorkingDir: "{app}"

[Run]
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall add rule name=""OquBot IDE"" dir=in action=allow program=""{app}\main2.exe"" enable=yes"; Flags: runhidden
Filename: "{sys}\netsh.exe"; Parameters: "advfirewall firewall add rule name=""OquBot IDE"" dir=out action=allow program=""{app}\main2.exe"" enable=yes"; Flags: runhidden
Filename: "{tmp}\CH340_setup.exe"; Tasks: install_driver; Description: "Установка драйвера CH340"; Flags: shellexec waituntilterminated

; ИСПРАВЛЕНО: Добавлен параметр WorkingDir для корректного первого запуска из инсталлятора
Filename: "{app}\main2.exe"; Description: "{cm:LaunchProgram,OquBot IDE}"; WorkingDir: "{app}"; Flags: nowait postinstall skipifsilent