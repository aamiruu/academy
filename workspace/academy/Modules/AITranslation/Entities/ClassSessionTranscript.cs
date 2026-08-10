using academy.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace academy.Modules.AITranslation.Entities
{
    public class ClassSessionTranscript
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SessionId { get; set; }
        
        [ForeignKey("SessionId")]
        public virtual OnlineClassSession? Session { get; set; }

        public int? UserId { get; set; }
        
        [MaxLength(100)]
        public string? SpeakerName { get; set; }

        [Required]
        public string OriginalText { get; set; } = string.Empty;

        public string? TranslatedText { get; set; }

        [MaxLength(10)]
        public string TargetLanguage { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
