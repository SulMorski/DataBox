using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DataBox.Models;

public partial class Item
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Type { get; set; } = null!;

    public string? Title { get; set; }

    public string? Content { get; set; }

    public byte[]? ImageData { get; set; }

    public int Position { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsFavorite { get; set; } = false;
    public virtual User User { get; set; } = null!;

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
