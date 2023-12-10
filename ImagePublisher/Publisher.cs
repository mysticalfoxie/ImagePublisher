using ImagePublisher.DeviantArt;

namespace ImagePublisher;

public static class Publisher
{
    public static async Task PublishOnDeviantArt(FileInfo image)
    {
        using var client = new DeviantArtClient();
        await client.LoginAsync();
        var stash = await client.UploadToStash(image);
        var publish = await client.PublishStashItem(new PublishRequestData
        {
            ItemId = stash.ItemId,
            AgreeSubmission = true,
            AgreeTos = true,
            AllowComments = true,
            AllowFreeDownload = true,
            IsMatureContent = false
        });

        // DeviantArt doesnt allow it to add tags... -> Add them afterwards by hand
        WebLink.Open($"https://www.deviantart.com/deviation/edit/{publish.DeviationId}");
    }

    public static void PublishOnPinterest(FileInfo image)
    {
        // Pinterest doesnt make it easy to create an API Application for non-commercials... -> Do it by hand
        WebLink.Open("https://www.pinterest.de/pin-creation-tool/");
    }

    public static void PublishOnInstagram(FileInfo image)
    {
        // Cant log into default instagram API cause it's a business Account
        // Cant log into Instagram Graphs API cuz it need the Facebook Graphs API
        // Facebook Graphs API requires advanced public profile permissions
        // advanced public profile permissions require a verified business account
        // a verified business account requires a registered business with legal papers
        //   --> Can't upload images to instagram
        WebLink.Open("https://www.instagram.com/");
    }
}

