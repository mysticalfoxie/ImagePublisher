using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using ImagePublisher.Core.Models;
using ImagePublisher.Core.Utils;
using Newtonsoft.Json;

namespace ImagePublisher.DeviantArt;

public class DAApiService : IDisposable
{
    private readonly HttpClient _client = new();

    public DAApiService()
    {
        CredentialsService.Load();
    }

    public async Task<StashUploadResponse> UploadToStash(PublishContext context)
    {
        Log.Write("Uploading image to sta.sh storage...");

        if (context.Config.DeviantArt.SkipStashUpload.GetValueOrDefault())
        {
            if (context.Config.DeviantArt.StashId.GetValueOrDefault() == default)
                throw new InvalidOperationException("The publish config requests to skip the stash upload but does not provide a StashId.");
            Debug.Assert(context.Config.DeviantArt.StashId != null, "context.Config.DeviantArt.StashId != null");
            
            Log.Write("Uploading image to sta.sh storage... @dSkipped.");
            return new StashUploadResponse
            {
                ItemId = context.Config.DeviantArt.StashId.Value
            };
        }

        using var content = new MultipartFormDataContent();
        var bearer = CredentialsService.Data.Session.BearerToken;
        content.Add(new StringContent(bearer), "access_token");

        await using var stream = new FileStream(context.Image.FullName, FileMode.Open);
        var imageContent = new StreamContent(stream);
        imageContent.Headers.ContentType = new MediaTypeHeaderValue("image/png");
        content.Add(imageContent, "image", context.Image.Name);

        var response = await _client.PostAsync("https://www.deviantart.com/api/v1/oauth2/stash/submit", content);
        response.EnsureSuccessStatusCode();
        
        Log.Overwrite("Uploading image to sta.sh storage... @gUploaded!");
        
        var json = await response.Content.ReadAsStringAsync();
        var data = JsonConvert.DeserializeObject<StashUploadResponse>(json);
        
        Log.Overwrite($"Uploading image to sta.sh storage... @gUploaded! @dItemId: {data.ItemId}");

        return data;
    }

    public async Task<PublishResponse> PublishStashItem(PublishContext context, PublishRequestData data)
    {
        Log.Write("Publishing stash item to DeviantArt...");
        
        if (context.Config.DeviantArt.SkipPublish.GetValueOrDefault())
        {
            if (string.IsNullOrWhiteSpace(context.Config.DeviantArt.DeviationId))
                throw new InvalidOperationException("The publish config requests to skip the stash upload but does not provide a StashId.");

            Log.Write("Publishing stash item to DeviantArt... @dSkipped.");
            return new PublishResponse
            {
                DeviationId = context.Config.DeviantArt.DeviationId,
                Url = $"https://www.deviantart.com/naughtyfoxie/art/{context.Config.DeviantArt.DeviationId}"
            };
        }

        using var content = new MultipartFormDataContent();
        var bearer = CredentialsService.Data.Session.BearerToken;
        content.Add(new StringContent(bearer), "access_token");
        content.Add(new StringContent(data.AgreeTos.ToString()), "agree_tos");
        content.Add(new StringContent(data.AgreeSubmission.ToString()), "agree_submission");
        content.Add(new StringContent(data.IsMatureContent.ToString()), "is_mature");
        content.Add(new StringContent(data.AllowComments.ToString()), "allow_comments");
        content.Add(new StringContent(data.AllowFreeDownload.ToString()), "allow_free_download");
        content.Add(new StringContent(data.ItemId.ToString()), "itemid");

        var response = await _client.PostAsync("https://www.deviantart.com/api/v1/oauth2/stash/publish", content);
        response.EnsureSuccessStatusCode();
        
        Log.Overwrite("Publishing stash item to DeviantArt... @gPublished!");
        
        var json = await response.Content.ReadAsStringAsync();
        var publish = JsonConvert.DeserializeObject<PublishResponse>(json);
        
        Log.Overwrite($"Publishing stash item to DeviantArt... @gPublished! @d{publish.Url}");

        var regex = new Regex(@"https://www.deviantart.com/[\d\w]*/art/.*-(\d*)");
        context.DeviationId = regex.Match(publish.Url).Groups[1].Value;
        context.DeviationUrl = publish.Url;
        
        return publish;
    }

    public async Task LoginAsync()
    {
        Log.Write("Logging into DeviantArt...");
        if (CanRecoverSession())
        {
            Log.Overwrite("Logging into DeviantArt... @gSkipped. @dPrevious session recovered.");
            return;
        } 

        var url = new StringBuilder()
            .Append("https://www.deviantart.com/oauth2/token")
            .Append("?grant_type=authorization_code")
            .Append($"&client_id={CredentialsService.Data.ClientId}")
            .Append($"&client_secret={CredentialsService.Data.ClientSecret}")
            .Append($"&code={CredentialsService.Data.AuthorizationCode}")
            .Append($"&redirect_uri={CredentialsService.Data.RedirectUrl}")
            .ToString();

        Log.Overwrite("Logging into DeviantArt... @dRequest login...");
        var response = await _client.GetAsync(url);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadAsStringAsync();
        var data = JsonConvert.DeserializeObject<LoginResponse>(json);
        CredentialsService.UpdateSession(new Session
        {
            BearerToken = data.AccessToken,
            ValidUntil = DateTime.Now.AddSeconds(data.ExpiresIn)
        });
        
        Log.Overwrite("Logging into DeviantArt... @gLogged in!           ");
    }

    public static bool CanRecoverSession()
    {
        var session = CredentialsService.Data.Session;
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