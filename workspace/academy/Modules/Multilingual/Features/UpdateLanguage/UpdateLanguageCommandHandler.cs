using academy.Data;
using academy.Modules.Multilingual.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace academy.Modules.Multilingual.Features.UpdateLanguage
{
    public class UpdateLanguageCommandHandler : IRequestHandler<UpdateLanguageCommand, bool>
    {
        private readonly AcademyContext _context;

        public UpdateLanguageCommandHandler(AcademyContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateLanguageCommand request, CancellationToken cancellationToken)
        {
            var language = await _context.Languages.FindAsync(new object[] { request.Id }, cancellationToken);
            if (language == null)
            {
                return false;
            }

            if (request.IsDefault && !language.IsDefault)
            {
                var existingDefaults = await _context.Languages.Where(l => l.IsDefault).ToListAsync(cancellationToken);
                foreach (var lang in existingDefaults)
                {
                    lang.IsDefault = false;
                }
            }

            language.Code = request.Code;
            language.DisplayName = request.DisplayName;
            language.Direction = request.Direction;
            language.IsDefault = request.IsDefault;
            language.IsActive = request.IsActive;

            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
