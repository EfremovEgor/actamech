import hashlib
import os
import pathlib
from typing import override
from uuid import UUID
from fastapi import Depends, UploadFile
from starlette.datastructures import UploadFile as StarletteUploadFile

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import get_app_settings
from app.database.database import get_async_session
from sqlalchemy.exc import IntegrityError

from app.models.files import File
from app.schemas.file import FileBase, FileInCreate
from app.services.base import BaseService
from app.utils import generate_random_hex_string


class FileService(BaseService):
    def get_abs_file_path(self, stored_name:str, extension:str)->str:
        settings = get_app_settings()
        return f"{settings.file_storage_path}/{stored_name}.{extension}" 
    
    def patch_upload_path(self):
        settings = get_app_settings()
        pathlib.Path(settings.file_storage_path).mkdir(parents=True, exist_ok=True)
        
    def get_file_meta(self, file: UploadFile):
        original_name, extension = os.path.splitext(file.filename)
        extension = extension.lstrip(".")
        return {
            "original_name": original_name,
            "extension": extension
        }
    
    def validate_extension(self, file: UploadFile | File, valid_extensions: list[str]):
        if isinstance(file, StarletteUploadFile):
            extension = self.get_file_meta(file)["extension"]
        elif isinstance(file, File):
            extension = file.extension.lower()
        else: 
            print(type(file))
            return False
        if extension not in [ext.lower() for ext in valid_extensions]:
            return False
        print(extension)

        return True
        
    
    def read_file(self, file: File):
        abs_path = self.get_abs_file_path(file.stored_name, file.extension)
        try:
            with open(abs_path, "rb") as f:
                contents = f.read()
        except FileNotFoundError:
            return None
        return contents
    
    async def get_file_contents(self, id: str | UUID)->tuple[File, bytes]|None :
        stmt = select(File).where(File.id == id)
        result = await self.db.execute(stmt)
        file = result.scalar_one_or_none()
        if file is None:
            return None

        abs_path = self.get_abs_file_path(file.stored_name, file.extension)

        try:
            with open(abs_path, "rb") as f:
                contents = f.read()
        except FileNotFoundError:
            return None
        
        return (file, contents)
    
    async def get_file(self, id: str | UUID)->File:
        stmt = select(File).where(File.id == id)
        result = await self.db.execute(stmt)
        file = result.scalar_one_or_none()
        return file
        
    async def delete_file_by_id(self, id: str | UUID):
        stmt = select(File).where(File.id == id)
        result = await self.db.execute(stmt)
        
        file = result.scalar_one_or_none()  
        if file is None:
            return
        
        
        
        try:
            os.remove(self.get_abs_file_path(file.stored_name, file.extension))
        except OSError:
            pass
        
        query = delete(File).where(File.id == id)
        await self.db.execute(query)
        await self.db.commit()
        
    async def save_uploaded_file(self, file: UploadFile):
        name_with_ext = file.filename
        original_name, extension = os.path.splitext(name_with_ext)
        extension = extension.lstrip(".")
        contents = await file.read()
        return await self.save_file(original_name, extension, contents)

        
    async def save_file(self, original_name: str, extension: str, contents: bytes)->File:
        self.patch_upload_path()
        
        stored_name = generate_random_hex_string(32)
        abs_path = self.get_abs_file_path(stored_name, extension)
        rel_path = f"{stored_name}.{extension}" 
        
        try:
            with open(abs_path, "wb") as f:
                f.write(contents)
                
        except Exception as ex:
            raise Exception("Couldn't save file to disk")
            
        
        file = File(
                    original_name=original_name, 
                    stored_name=stored_name, 
                    extension=extension, 
                    path=rel_path, 
                    size_bytes=len(contents), 
                    hash=hashlib.sha256(contents).hexdigest()
        )
        
        self.db.add(file)
        
        try:
            await self.db.commit()
            await self.db.refresh(file)
        except Exception as ex:
            print(ex)
            await self.db.rollback()
            if os.path.exists(abs_path):
                os.remove(abs_path)
            print("Couldn't save file to database")
            raise Exception("Couldn't save file to database")

            
        return file
        
    def get_file_contents():
        ...
    
    
    
def get_file_service(db: AsyncSession = Depends(get_async_session)):
    print(db)
    return FileService(db)