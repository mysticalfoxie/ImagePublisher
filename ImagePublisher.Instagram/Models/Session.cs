using Newtonsoft.Json;

namespace ImagePublisher.DeviantArt;

public class Session
{
    [JsonProperty("bearer_token")]
    public string BearerToken { get; set; }
    
    [JsonProperty("valid_until")]
    public DateTime ValidUntil { get; set; }
}