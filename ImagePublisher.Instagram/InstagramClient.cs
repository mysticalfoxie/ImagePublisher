using System.Text;
using ImagePublisher.DeviantArt;
using Newtonsoft.Json;

namespace ImagePublisher.Instagram;

public class InstagramClient : IDisposable
{
    private readonly HttpClient _client = new();

    public InstagramClient()
    {
        CredentialsFile.Load();
    }

    public async Task LoginAsync()
    {
        if (CanRecoverSession()) return;

        var url = new StringBuilder()
            .Append("https://www.deviantart.com/oauth2/token")
            .Append("?grant_type=authorization_code")
            .Append($"&client_id={CredentialsFile.Data.ClientId}")
            .Append($"&client_secret={CredentialsFile.Data.ClientSecret}")
            .Append($"&code={CredentialsFile.Data.AuthorizationCode}")
            .Append($"&redirect_uri={CredentialsFile.Data.RedirectUrl}")
            .ToString();

        var response = await _client.GetAsync(url);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        //var data = JsonConvert.DeserializeObject<LoginResponse>(json);
        // CredentialsFile.UpdateSession(new Session
        // {
        //     BearerToken = data.AccessToken,
        //     ValidUntil = DateTime.Now.AddSeconds(data.ExpiresIn)
        // });
    }

    public static bool CanRecoverSession()
    {
        var session = CredentialsFile.Data.Session;
        if (session is null) return false;
        if (DateTime.Now.AddMinutes(10) >= session.ValidUntil) return false;
        return true;
    }

    public void Dispose()
    {
        _client.Dispose();
        GC.SuppressFinalize(this);
    }
}