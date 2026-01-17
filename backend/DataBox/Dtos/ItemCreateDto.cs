namespace DataBox.Dtos
{
    public class ItemCreateDto
    {
        public int UserId { get; set; }
        public string Type { get; set; } = null!;
        public string? Title { get; set; }
        public string? Content { get; set; }
        public IFormFile? ImageFile { get; set; } // jeśli przesyłasz obraz z frontend
        public int Position { get; set; } = 0;
        public bool IsFavorite { get; set; } = false;
        public List<int>? TagIds { get; set; } // opcjonalnie tagi
    }
}