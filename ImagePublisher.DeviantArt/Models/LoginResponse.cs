using Newtonsoft.Json;

namespace ImagePublisher.DeviantArt;

public class LoginResponse
{
    [JsonProperty("access_token")]
    public string AccessToken { get; set; }
    
    [JsonProperty("expires_in")]
    public int ExpiresIn { get; set; }
}