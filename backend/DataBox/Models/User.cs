using System;
using System.Collections.Generic;

namespace DataBox.Models;

public partial class User
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public DateTime? LastOnline { get; set; }

    public virtual ICollection<Item> Items { get; set; } = new List<Item>();
}
