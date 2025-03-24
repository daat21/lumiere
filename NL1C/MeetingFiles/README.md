## Meeting File Naming Convention

To ensure clear communication and consistent documentation across the project, all meeting-related files follow a structure naming convention based on:

- **Meeting Type**: 'Client' or 'Group'
- **Document Type**: 'Agenda' or 'Minutes'
- **Sprint Phase and Week**: e.g., 'Sprint1-Week2'
- **Meeting Sequence (if multiple in one week)**: '-1', '-2', etc.
- **Date** (recommended for Minutes): in 'YYYY-MM-DD' format
---

### Basic Format

[MeetingType]_[DocumentType]Sprint[Number]-Week[Number]-[MeetingNumber][OptionalDate].md

---

### Examples
#### Weekly Client Meetings (Single)

| File Type | File Name |
|-----------|-----------|
| Client Meeting Agenda | 'Client_Agenda_Sprint1-Week2.md' |
| Client Meeting Minutes | 'Client_Minutes_Sprint1-Week2_2025-03-25.md' |

#### Multiple Group Meetings in One Week

| File Type | File Name |
|-----------|-----------|
| First Group Agenda | 'Group_Agenda_Sprint1-Week2-1.md' |
| First Group Minutes | 'Group_Minutes_Sprint1-Week2-1_2025-03-24.md' |
| Second Group Agenda | 'Group_Agenda_Sprint1-Week2-2.md' |
| Second Group Minutes | 'Group_Minutes_Sprint1-Week2-2_2025-03-28.md' |

---

### Notes
- 'Minutes' files **should** include the date for better traceability.
- The '-1', '-2' suffix is used **only when there are multiple meetings in the same week**.
- All files are written in **Markdown (.md)** format for GitHub compatibility and version control.
