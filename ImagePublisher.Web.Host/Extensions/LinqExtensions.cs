using Newtonsoft.Json;

namespace ImagePublisher.Web.Host.Extensions;

public static class LinqExtensions
{
    public static IEnumerable<IEnumerable<T>> Batch<T>(this IEnumerable<T> source, int size)
    {
        T[] bucket = null;
        var count = 0;

        foreach (var item in source)
        {
            bucket ??= new T[size];
            bucket[count++] = item;
            if (count != size) continue;
            yield return bucket;
            bucket = null;
            count = 0;
        }

        if (bucket != null && count > 0)
            yield return bucket.Take(count).ToArray();
    }

    public static IEnumerable<T> JsonConvertTo<T>(this IEnumerable<string> source, bool ignoreErrors)
    {
        foreach (var item in source)
        {
            T data;
            try
            {
                data = JsonConvert.DeserializeObject<T>(item);
            }
            catch
            {
                if (ignoreErrors) continue;
                throw;
            }

            if (data is not null)
                yield return data;
        }
    }
}