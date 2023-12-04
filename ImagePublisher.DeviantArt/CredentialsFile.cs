using Newtonsoft.Json;

namespace ImagePublisher.DeviantArt;

public static class CredentialsFile
{
    public const string FILENAME = "deviantart-credentials.json";
    
    public static Credentials Data { get; set; }
    
    public static void Load()
    {
        var json = File.ReadAllText(FILENAME);
        Data = JsonConvert.DeserializeObject<Credentials>(json);
    }

    public static void UpdateSession(Session session)
    {
        Data.Session = session;
        var json = JsonConvert.SerializeObject(Data, Formatting.Indented);
        File.WriteAllText(FILENAME, json);
    }
}