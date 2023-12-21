using Newtonsoft.Json;

namespace ImagePublisher.Web.Host.Models;

public class GeneralPresetModel
{
    [JsonProperty("title")]
    public string Title { get; set; }
    [JsonProperty("description")]
    public string Description { get; set; }
    [JsonProperty("tags")]
    public string Tags { get; set; }
    [JsonProperty("hdld")]
    public bool UseHDLDImages { get; set; }
}