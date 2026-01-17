using System;
using System.Collections.Generic;

namespace DataBox.Models;

public partial class Tag
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
    public virtual ICollection<Item> Items { get; set; } = new List<Item>();
}
