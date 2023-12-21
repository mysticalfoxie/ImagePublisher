using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace ImagePublisher.Web.Host.Models;

public class PresetFormData
{
    [JsonProperty("json")]
    [JsonPropertyName("json")]
    public string Json { get; set; }
    
    [JsonProperty("image")]
    [JsonPropertyName("image")]
    public IFormFile Image { get; set; }
    
    [JsonProperty("hdImage")]
    [JsonPropertyName("hdImage")]
    public IFormFile HDImage { get; set; }
    
    [JsonProperty("ldImage")]
    [JsonPropertyName("ldImage")]
    public IFormFile LDImage { get; set; }
}