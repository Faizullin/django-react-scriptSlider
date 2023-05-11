from django.test import TestCase

# Create your tests here.
from docx import Document
from django.db import transaction, IntegrityError
from script.models import Script
from script_page.models import ScriptPage
from authentication.models import User


class DOCXParserTestCase(TestCase):
    def setUp(self):
        self.doc = Document('test.docx')
        self.doc

    def test_animals_can_speak(self):
        """Animals that can speak are correctly identified"""
        doc = self.doc
        user = User.objects.create(username='1',email='admin1@example.com')
        # for sec in doc.sections:
        #     print("section",sec.name)
        try:
            with transaction.atomic():
                script = Script.objects.create(title= 'First Test', owner= user)
                script.save()
                title_counter = 0
                prev_title_counter = 0
                script_pages = []
                for i,para in enumerate(doc.paragraphs):
                    if para.text is not None:
                        if para.style.name == 'Title':
                            title_counter += 1
                            script_pages.append(ScriptPage(title = f'Page-{title_counter}', content='', script = script, index = title_counter))
                        elif para.text and title_counter > 0:
                            if prev_title_counter == title_counter:
                                script_pages[title_counter - 1].content += (para.text + '<br/>')
                            else:
                                script_pages[title_counter - 1].content += (para.text + '<br/>')
                                prev_title_counter = title_counter
            for script_page in script_pages:
                script_page.save()                    
        except Exception as err:
            print('IntegrityError',err)
        print(ScriptPage.objects.all())
        print([i.content for i in ScriptPage.objects.all()])
        # self.assertEqual(cat.speak(), 'The cat says "meow"')