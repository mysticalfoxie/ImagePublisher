using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace ImagePublisher.Web.Host.Models;

public class GeneralPresetModel
{
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string Title { get; set; }
    
    [JsonProperty("description")]
    [JsonPropertyName("description")]
    public string Description { get; set; }
    
    [JsonProperty("tags")]
    [JsonPropertyName("tags")]
    public string Tags { get; set; }
    
    [JsonProperty("hdld")]
    [JsonPropertyName("hdld")]
    public bool UseHDLDImages { get; set; }
    
    [JsonProperty("image")]
    [JsonPropertyName("image")]
    public string Image { get; set; }
    
    [JsonProperty("hdImage")]
    [JsonPropertyName("hdImage")]
    public string HDImage { get; set; }
    
    [JsonProperty("ldImage")]
    [JsonPropertyName("ldImage")]
    public string LDImage { get; set; }
    
}