using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace ImagePublisher.DeviantArt;

public class Credentials
{
    [JsonProperty("client_id")]
    public string ClientId { get; set; }
    
    [JsonProperty("client_secret")]
    public string ClientSecret { get; set; }
    
    [JsonProperty("redirect_url")]
    public string RedirectUrl { get; set; }
    
    [JsonProperty("authorization_code")]
    public string AuthorizationCode { get; set; }
    
    [JsonProperty("session")]
    public Session Session { get; set; }
}