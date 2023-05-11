from django.test import TestCase

# Create your tests here.
from docx import Document

class DOCXParser():
    def __init__(self,file):
        self.doc = Document(file)
        self.doc

    def get_content_by_sections(self):
        title_counter = 0
        script_pages = []
        for i,para in enumerate(self.doc.paragraphs):
            if para.text is not None:
                if para.style.name == 'Title':
                    title_counter += 1
                    script_pages.append([para.text, ''])
                elif para.text and title_counter > 0:
                    script_pages[title_counter - 1][1] += (para.text + '<br/>')
        return script_pages