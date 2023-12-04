using System.Text.Json.Serialization;

namespace ImagePublisher.DeviantArt;

public class LoginResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }
    
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}