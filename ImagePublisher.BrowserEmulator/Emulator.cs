using System.Diagnostics;
using CefSharp;
using CefSharp.WinForms;

namespace ImagePublisher.BrowserEmulator;

public static class Emulator
{
    public const Environment.SpecialFolder LOCAL_DATA_FOLDER = Environment.SpecialFolder.LocalApplicationData;
    private static MainForm _window;

    [STAThread]
    public static void Main()
    {
        Initialize();
        _window.Browser.LoadUrl("https://deviantart.com");
        Application.Run(_window);
    }

    private static void Initialize()
    {
        ApplicationConfiguration.Initialize();
        var settings = new CefSettings();
        var localDataFolderPath = Environment.GetFolderPath(LOCAL_DATA_FOLDER);
        var cachePath = Path.Combine(localDataFolderPath, "ImagePublisher");
        settings.CachePath = cachePath;
        settings.PersistSessionCookies = true;
        settings.PersistUserPreferences = true;
        Cef.Initialize(settings);

        _window = new MainForm();
        _window.UrlLoaded += OnUrlLoaded;
        _window.InitialLoad += OnInitialLoad;
    }

    private static void OnUrlLoaded(string address)
    {
        var location = ParseLocation(address);
        ;
    }

    private static void OnInitialLoad()
    {
        _window.Browser.ShowDevTools();
        EnsureLoggedIn();
    }

    private static void EnsureLoggedIn()
    {
        if (_window.Browser.HasDeviantArtAuthCookie())
        {
            _window.Log("User is logged in.");
            Debug.WriteLine("User is logged in.");
            return;
        }

        Debug.WriteLine("User is not logged in. Please sign in to proceed.");
        _window.Log("User is not logged in. Please sign in to proceed.");
        _window.Alert("Please sign in to procceed.");
        _window.Browser.WaitForDeviantArtAuthCookie();
    }

    private static object ParseLocation(string address)
    {
        // if (address is null) throw new ArgumentNullException(nameof(address));
        // if (address.StartsWith("https://www.deviantart.com/users/login")) return Location.LoginPage;
        // if (address.StartsWith("https://www.deviantart.com")) return Location.HomePage;
        // throw new Exception("Could not determine on which page the browser is navigated.");
    }
}

internal enum Location
{
    HomePage,
    LoginPage,
}