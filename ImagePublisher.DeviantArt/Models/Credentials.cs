using System.Text.Json.Serialization;

namespace ImagePublisher.DeviantArt;

public class Credentials
{
    [JsonPropertyName("client_id")]
    public string ClientId { get; set; }
    
    [JsonPropertyName("client_secret")]
    public string ClientSecret { get; set; }
    
    [JsonPropertyName("redirect_url")]
    public string RedirectUrl { get; set; }
    
    [JsonPropertyName("authorization_code")]
    public string AuthorizationCode { get; set; }
    
    [JsonPropertyName("session")]
    public Session Session { get; set; }
}