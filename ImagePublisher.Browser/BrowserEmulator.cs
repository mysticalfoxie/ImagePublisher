using CefSharp;
using CefSharp.WinForms;
using ImagePublisher.Core.Utils;

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
    public ChromiumWebBrowser Browser => Window?.Browser;
    public bool ShowDevToolsOnStartup { get; set; }

    public BrowserEmulator()
    {
        Initialize();
    }
    
    public void Start()
    {
        Task.Factory.StartNew(() =>
        {
            Browser.LoadUrl("about:blank");
            Application.Run(Window);
        }).GetAwaiter();

        // ReSharper disable once RedundantJumpStatement
        while (!Browser.IsBrowserInitialized) continue;
        Application.ThreadException += (_, args) => Log.Write("@rThreadException: " + args.Exception.Message);
    }

    public void Navigate(string url)
    {
        var taskCompletionSource = new TaskCompletionSource();
        
        // Url Loaded - EventHandler
        Action unsubscribe = null;
        void Callback(object o, string e)
        {
            taskCompletionSource.SetResult();
        
            // ReSharper disable once PossibleNullReferenceException
            // ReSharper disable once AccessToModifiedClosure
            unsubscribe();
        }
        
        // Subscribe + Unsubscribe
        Window.UrlLoaded += Callback;
        unsubscribe = () => Window.UrlLoaded -= Callback;
        
        // And here the final action
        Browser.LoadUrl(url);

        taskCompletionSource.Task.Wait();
    }

    private void Initialize()
    {
        ApplicationConfiguration.Initialize();
        var settings = new CefSettings();
        var localDataFolderPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        var cachePath = Path.Combine(localDataFolderPath, "ImagePublisher");
        settings.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 /CefSharp Browser" + Cef.CefSharpVersion;
        settings.LogSeverity = LogSeverity.Error;
        settings.CachePath = cachePath;
        settings.PersistSessionCookies = true;
        settings.PersistUserPreferences = true;
        Cef.Initialize(settings);

        Window = new MainForm();
        Window.InitialLoad += OnInitialLoad;
        Browser.KeyboardHandler = new DevToolsHandler();
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