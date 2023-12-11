namespace ImagePublisher.DeviantArt;

public class DAPublishConfig
{
    public bool Enabled { get; set; }
    
    public bool? AddTags { get; set; } 
    public string Tags { get; set; }
    
    public bool? AddCharacter { get; set; }
    public string Character { get; set; }
    
    public bool? AddLocation { get; set; }
    public string Location { get; set; }
    
    public bool? SkipPublish { get; set; }
    public string DeviationId { get; set; }
    
    public bool? SkipStashUpload { get; set; }
    public long? StashId { get; set; }
    
    public bool? LaunchBrowserAfterEdit { get; set; }
}