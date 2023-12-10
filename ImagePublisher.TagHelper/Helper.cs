namespace ImagePublisher.TagHelper;

public static class Helper
{
    public static string[] RemoveDuplicates(string[] tags)
    {
        return tags.Distinct().ToArray();
    }
}