using CefSharp;

namespace ImagePublisher.Browser;

public class DevToolsHandler : IKeyboardHandler
{
    public bool OnKeyEvent(IWebBrowser browserControl, IBrowser browser, KeyType type, int windowsKeyCode, int nativeKeyCode, CefEventFlags modifiers, bool isSystemKey)
    {
        if (type != KeyType.KeyUp || !Enum.IsDefined(typeof(Keys), windowsKeyCode)) return false;
        if ((Keys)windowsKeyCode != Keys.F12) return false;
        
        browser.ShowDevTools();
        return false;
    }

    public bool OnPreKeyEvent(IWebBrowser browserControl, IBrowser browser, KeyType type, int windowsKeyCode, int nativeKeyCode, CefEventFlags modifiers, bool isSystemKey, ref bool isKeyboardShortcut)
    {
        return false;
    }
}