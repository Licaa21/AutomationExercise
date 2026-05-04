namespace AutomationExercise.api.Models
{
    public class Order
    {
        public int OrderID { get; set; }
        public int OrderNumber { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public string? Mentions { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public int UserID { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    
    }
}