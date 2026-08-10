using academy.Data;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace academy.Modules.Multilingual.Features.DeleteLanguage
{
    public class DeleteLanguageCommandHandler : IRequestHandler<DeleteLanguageCommand, bool>
    {
        private readonly AcademyContext _context;

        public DeleteLanguageCommandHandler(AcademyContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(DeleteLanguageCommand request, CancellationToken cancellationToken)
        {
            var language = await _context.Languages.FindAsync(new object[] { request.Id }, cancellationToken);
            if (language == null)
            {
                return false;
            }

            _context.Languages.Remove(language);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
