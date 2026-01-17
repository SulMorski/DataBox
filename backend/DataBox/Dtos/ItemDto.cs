namespace DataBox.Dtos
{
    public class ItemDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Type { get; set; } = null!;
        public string? Title { get; set; }
        public string? Content { get; set; }
        public byte[]? ImageData { get; set; }
        public int Position { get; set; }
        public bool IsFavorite { get; set; }

        public List<int> TagIds { get; set; } = new();
    }
}
