using Newtonsoft.Json;

namespace ImagePublisher.DeviantArt;

public class StashUploadResponse
{
    [JsonProperty("itemid")]
    public long ItemId { get; set; }
}