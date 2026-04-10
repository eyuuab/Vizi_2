const fs = require('fs');
const path = 'components/dashboard/create-presentation-dialog.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  `            case 'section': {
              const sectionData = event.data as SectionContentGenerated;
              collectedSections.push(sectionData);
              setSections([...collectedSections]);
              break;
            }`,
  `            case 'section': {
              const sectionData = event.data as SectionContentGenerated;
              const idx = collectedSections.findIndex((s) => s.sectionIndex === sectionData.sectionIndex);
              if (idx >= 0) {
                collectedSections[idx] = sectionData;
              } else {
                collectedSections.push(sectionData);
              }
              setSections([...collectedSections]);
              break;
            }`
);

fs.writeFileSync(path, code);
