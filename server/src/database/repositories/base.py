from typing import Any, Dict, Generic, List, Optional, TypeVar

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection, AsyncIOMotorDatabase

from src.database.connection import mongo

T = TypeVar('T')


class BaseRepository(Generic[T]):
    """Base repository class for MongoDB collections"""

    def __init__(self, db: Optional[AsyncIOMotorDatabase] = None, collection_name: str = None):
        self._db = db if db is not None else mongo.db
        if self._db is None:
            raise RuntimeError(
                "Database not initialized. Make sure FastAPI's lifespan event is properly configured.")
        self._collection: AsyncIOMotorCollection = self._db[collection_name]

    @property
    def collection(self) -> AsyncIOMotorCollection:
        """Get the MongoDB collection"""
        if self._collection is None:
            mongo._ensure_connected()
            self._collection = mongo.db[self.collection_name]
        return self._collection

    async def ensure_collection(self):
        """Ensure the collection exists and is accessible"""
        if self._collection is None:
            mongo._ensure_connected()
            self._collection = mongo.db[self.collection_name]
            # Verify collection exists by performing a simple operation
            await self._collection.find_one({})

    async def create(self, data: Dict[str, Any]) -> str:
        """Create a new document"""
        result = await self.collection.insert_one(data)
        return str(result.inserted_id)

    async def get_by_id(self, id: str) -> Optional[Dict[str, Any]]:
        """Get document by ID"""
        return await self.collection.find_one({"_id": ObjectId(id)})

    async def update(self, id: str, data: Dict[str, Any]) -> bool:
        """Update document by ID"""
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": data}
        )
        return result.modified_count > 0

    async def delete(self, id: str) -> bool:
        """Delete document by ID"""
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Find one document matching query"""
        return await self.collection.find_one(query)

    async def find_many(self, query: Dict[str, Any], limit: int = 100, skip: int = 0) -> List[Dict[str, Any]]:
        """Find many documents matching query"""
        cursor = self.collection.find(query).skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def count(self, query: Dict[str, Any]) -> int:
        """Count documents matching query"""
        return await self.collection.count_documents(query)

    @staticmethod
    def to_object_id(id_str: str) -> ObjectId:
        """Convert a string to a MongoDB ObjectId, raise ValueError if invalid."""
        try:
            return ObjectId(id_str)
        except Exception:
            raise ValueError(f"Invalid ObjectId: {id_str}")
