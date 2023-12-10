using CefSharp;
using CefSharp.WinForms;

namespace ImagePublisher.Browser;

public interface IBrowserEmulator
{
    public MainForm Window { get; }
    public ChromiumWebBrowser Browser { get; }
    public bool ShowDevToolsOnStartup { get; set; }
    public void Start();
}

public class BrowserEmulator : IDisposable, IBrowserEmulator
{
    public MainForm Window { get; private set; }
    public ChromiumWebBrowser Browser => Window.Browser;
    public bool ShowDevToolsOnStartup { get; set; }
    
    public void Start()
    {
        Initialize();
        Window.Browser.LoadUrl("about:version");
        Application.Run(Window);
    }

    private void Initialize()
    {
        ApplicationConfiguration.Initialize();
        var settings = new CefSettings();
        var localDataFolderPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var cachePath = Path.Combine(localDataFolderPath, "ImagePublisher");
        settings.CachePath = cachePath;
        settings.PersistSessionCookies = true;
        settings.PersistUserPreferences = true;
        Cef.Initialize(settings);

        Window = new MainForm();
        Window.InitialLoad += OnInitialLoad;
    }

    private void OnInitialLoad(object sender, EventArgs e)
    {
        if (ShowDevToolsOnStartup)
            Window.Browser.ShowDevTools();
    }

    public void Dispose()
    {
        Application.Exit();
        Window?.Browser?.Dispose();
        Window?.Dispose();
        GC.SuppressFinalize(this);
    }
}