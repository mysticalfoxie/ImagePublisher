namespace ImagePublisher.Web.Host.Models;

public class PresetMetaDataModel
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int Tags { get; set; }
    public string Thumbnail { get; set; }
    public DateTime CreatedAt { get; set; }
}