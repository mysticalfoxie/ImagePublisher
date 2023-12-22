using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace ImagePublisher.Web.Host.Models;

public class PresetModel
{
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public Guid? Id { get; set; }
    
    [JsonProperty("general")]
    [JsonPropertyName("general")]
    public GeneralPresetModel General { get; set; }
    
    [JsonProperty("deviantart")]
    [JsonPropertyName("deviantart")]
    public DAPresetModel DeviantArt { get; set; }
    
    [JsonProperty("facebook")]
    [JsonPropertyName("facebook")]
    public FBPresetModel Facebook { get; set; }
    
    [JsonProperty("instagram")]
    [JsonPropertyName("instagram")]
    public IGPresetModel Instagram { get; set; }
    
    [JsonProperty("pinterest")]
    [JsonPropertyName("pinterest")]
    public PTPresetModel Pinterest { get; set; }
    
    [JsonProperty("createdAt")]
    [JsonPropertyName("createdAt")]
    public DateTime? CreatedAt { get; set; }
    
}