using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AutomationExercise.api.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}