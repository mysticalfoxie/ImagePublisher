using Newtonsoft.Json;

namespace ImagePublisher.DeviantArt;

public class PublishResponse
{
    [JsonProperty("deviationid")]
    public string DeviationId { get; set; }
    
    [JsonProperty("url")]
    public string Url { get; set; }
}