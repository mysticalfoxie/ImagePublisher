using System.Text.Json.Serialization;

namespace ImagePublisher.DeviantArt;

public class Session
{
    [JsonPropertyName("bearer_token")]
    public string BearerToken { get; set; }
    
    [JsonPropertyName("valid_until")]
    public DateTime ValidUntil { get; set; }
}