namespace DataBox.Services
{
    public class ImageBytea
    {
        public static byte[] ConvertToBytea(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Plik jest pusty lub null.", nameof(file));

            using var ms = new MemoryStream();
            file.CopyTo(ms); // kopiujemy zawartość pliku do MemoryStream
            return ms.ToArray(); // zwracamy tablicę bajtów
        }
    }
}
