!include "nsDialogs.nsh"

!ifndef BUILD_UNINSTALLER
  Var desktopShortcutCheckbox
  Var desktopShortcutRequested

  !macro customInit
    ${If} $hasPerUserInstallation == "0"
    ${AndIf} $hasPerMachineInstallation == "0"
      StrCpy $INSTDIR "$APPDATA\${APP_FILENAME}"
    ${EndIf}
    StrCpy $desktopShortcutRequested "1"
  !macroend

  !macro customCheckAppRunning
    DetailPrint 'Closing running "${PRODUCT_NAME}"...'
    nsExec::ExecToLog `"$SYSDIR\taskkill.exe" /f /t /im "${APP_EXECUTABLE_FILENAME}"`
    Sleep 1500
  !macroend

  !macro customPageAfterChangeDir
    Page custom DesktopShortcutPage DesktopShortcutPageLeave
  !macroend

  Function DesktopShortcutPage
    nsDialogs::Create 1018
    Pop $0
    ${If} $0 == error
      Abort
    ${EndIf}

    ${NSD_CreateLabel} 0 0 100% 18u "Choose whether to create a desktop shortcut."
    Pop $0

    ${NSD_CreateCheckbox} 0 24u 100% 14u "Create a desktop shortcut"
    Pop $desktopShortcutCheckbox
    ${If} $desktopShortcutRequested == "1"
      ${NSD_Check} $desktopShortcutCheckbox
    ${EndIf}

    nsDialogs::Show
  FunctionEnd

  Function DesktopShortcutPageLeave
    ${NSD_GetState} $desktopShortcutCheckbox $desktopShortcutRequested
  FunctionEnd

  !macro customInstall
    ${If} $desktopShortcutRequested != ${BST_CHECKED}
      Delete "$newDesktopLink"
    ${EndIf}
  !macroend
!endif
