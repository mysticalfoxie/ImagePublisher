using System.Text;
using Newtonsoft.Json;

namespace ImagePublisher.DeviantArt;

public class DeviantArtClient
{
    public DeviantArtClient()
    {
        CredentialsFile.Load();
    }

    public static async Task UploadImage(FileInfo file)
    {
        using var client = new HttpClient();
        using var content = new MultipartFormDataContent();

        var bearer = CredentialsFile.Data.Session.BearerToken;
        content.Add(new StringContent(bearer), "access_token");

        await using var stream = new FileStream(file.FullName, FileMode.Open);
        var imageContent = new StreamContent(stream);
        imageContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/png");
        content.Add(imageContent, "file", file.Name);

        var response = await client.PostAsync("https://www.deviantart.com/api/v1/oauth2/deviation/submit", content);
        response.EnsureSuccessStatusCode();
        
        var responseContent = await response.Content.ReadAsStringAsync();
    }

    public static async Task LoginAsync()
    {
        if (CanRecoverSession()) return;

        using var client = new HttpClient();
        var url = new StringBuilder()
            .Append("https://www.deviantart.com/oauth2/token")
            .Append("?grant_type=authorization_code")
            .Append($"&client_id={CredentialsFile.Data.ClientId}")
            .Append($"&client_secret={CredentialsFile.Data.ClientSecret}")
            .Append($"&code={CredentialsFile.Data.AuthorizationCode}")
            .Append($"&redirect_uri={CredentialsFile.Data.RedirectUrl}")
            .ToString();

        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        var data = JsonConvert.DeserializeObject<LoginResponse>(json);
        CredentialsFile.UpdateSession(new Session
        {
            BearerToken = data.AccessToken,
            ValidUntil = DateTime.Now.AddSeconds(data.ExpiresIn)
        });
    }

    public static bool CanRecoverSession()
    {
        var session = CredentialsFile.Data.Session;
        if (session is null) return false;
        if (DateTime.Now.AddMinutes(10) >= session.ValidUntil) return false;
        return true;
    }
}