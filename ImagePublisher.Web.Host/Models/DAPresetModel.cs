using Newtonsoft.Json;

namespace ImagePublisher.Web.Host.Models;

public class DAPresetModel
{
    [JsonProperty("title")]
    public string Title { get; set; }
    [JsonProperty("description")]
    public string Description { get; set; }
    [JsonProperty("tags")]
    public string Tags { get; set; }
    [JsonProperty("character")]
    public string Character { get; set; }
    [JsonProperty("location")]
    public string Location { get; set; }
}