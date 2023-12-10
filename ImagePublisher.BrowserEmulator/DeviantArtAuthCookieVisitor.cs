using CefSharp;

namespace ImagePublisher.BrowserEmulator;

public class DeviantArtAuthCookieVisitor : ICookieVisitor
{
    public bool HasAuthCookie { get; private set; }
    public Action Complete { get; set; }

    public bool Visit(Cookie cookie, int index, int count, ref bool deleteCookie)
    {
        if (cookie.Name == "userinfo")
            HasAuthCookie = true;
        if (index == count - 1)
            Complete?.Invoke();
        return true;
    }
    
    public void Dispose()
    {
        GC.SuppressFinalize(this);
    }
}