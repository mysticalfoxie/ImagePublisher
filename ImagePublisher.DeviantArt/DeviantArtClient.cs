using System.Net.Http.Headers;
using System.Text;
using AngleSharp;
using Newtonsoft.Json;

namespace ImagePublisher.DeviantArt;

public class DeviantArtClient : IDisposable
{
    private readonly HttpClient _client = new();

    public DeviantArtClient()
    {
        CredentialsFile.Load();
    }

    public async Task OpenDeviantart()
    {
        var response = await _client.GetAsync("https://www.deviantart.com");
        response.EnsureSuccessStatusCode();

        var html = await response.Content.ReadAsStringAsync();
        var context = BrowsingContext.New(Configuration.Default);
        using var document = await context.OpenAsync(x => x.Content(html));
        ;
    }

    public async Task<StashUploadResponse> UploadToStash(FileInfo file)
    {
        using var content = new MultipartFormDataContent();

        var bearer = CredentialsFile.Data.Session.BearerToken;
        content.Add(new StringContent(bearer), "access_token");

        await using var stream = new FileStream(file.FullName, FileMode.Open);
        var imageContent = new StreamContent(stream);
        imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");
        content.Add(imageContent, "file", file.Name);

        var response = await _client.PostAsync("https://www.deviantart.com/api/v1/oauth2/stash/submit", content);
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<StashUploadResponse>(json);
    }

    public async Task<PublishResponse> PublishStashItem(PublishRequestData data)
    {
        using var content = new MultipartFormDataContent();

        var bearer = CredentialsFile.Data.Session.BearerToken;
        content.Add(new StringContent(bearer), "access_token");
        content.Add(new StringContent(data.AgreeTos.ToString()), "agree_tos");
        content.Add(new StringContent(data.AgreeSubmission.ToString()), "agree_submission");
        content.Add(new StringContent(data.IsMatureContent.ToString()), "is_mature");
        content.Add(new StringContent(data.AllowComments.ToString()), "allow_comments");
        content.Add(new StringContent(data.AllowFreeDownload.ToString()), "allow_free_download");
        content.Add(new StringContent(data.ItemId.ToString()), "itemid");

        var response = await _client.PostAsync("https://www.deviantart.com/api/v1/oauth2/stash/publish", content);
        response.EnsureSuccessStatusCode();
        
        var json = await response.Content.ReadAsStringAsync();
        return JsonConvert.DeserializeObject<PublishResponse>(json);
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

    public void Dispose()
    {
        _client.Dispose();
        GC.SuppressFinalize(this);
    }
}