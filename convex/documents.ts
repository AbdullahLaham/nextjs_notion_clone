import { v } from "convex/values";
import {mutation, query} from './_generated/server'
import {Doc, Id} from './_generated/dataModel';
import { useMutation } from "convex/react";
import { error } from "console";
// export const get = query({
//     handler: async (ctx) => {
//         const identity = await ctx.auth.getUserIdentity();
//         if (!identity) {
//             throw new Error("not authenticated")
//         }
//         const documents = await ctx.db.query('document').collect();
//         return documents;
//     }
// })
export const archive = mutation({
    args: {id: v.id("document")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("not authenticated")
        }
        const userId = identity?.subject;
        
        const existingDocument = await ctx.db.get(args.id);
        if (!existingDocument) throw new Error("not found");
        if (existingDocument?.userId !== userId) throw new Error("unauthorized");

        const recursiveArchive = async (documentId: Id<"document">) => {
            const children = await ctx.db
            .query("document")
            .withIndex("by_user_parent", (q) => (
                q.eq("userId", userId).eq("parentDocument", documentId)
                

            )).collect();

            for (const child of children) {
                await ctx.db.patch(child?._id, {
                    isArchived: true
                })
                await recursiveArchive(child?._id)

            }

        }
        const document = await ctx.db.patch(args.id, {
            isArchived: true,
        });
        recursiveArchive(args?.id)
        return document;
    }
})
export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id("document"))
    },
    handler: async (ctx, args: any) => {
        
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("not authenticated")
        }
        const userId = identity?.subject;
        
        const documents = await ctx.db
        .query("document")
        .withIndex("by_user_parent", (q) => 
            q
                .eq("userId", userId)
                .eq("parentDocument", args.parentDocument)
        )
        .filter((q) => 
            q.eq(q.field("isArchived"), false)
        )
        .order("desc")
        .collect();
        return documents



    }

})

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("document"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("not authenticated")
        }
        const userId = identity.subject;
        const document = await ctx.db.insert("document", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });
        return document;
    }
});

export const getTrash = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("not authenticated")
        }
        const userId = identity.subject;
        const archivedDocuments = await ctx.db.query("document")
        .withIndex("by_user", (q) => 
            q
                .eq("userId", userId)
        )
        .filter((q) => 
            q.eq(q.field("isArchived"), true)
        )
        .order("desc").collect()

        return archivedDocuments;
    }
})
export const restore = mutation({
    args: {id: v.id("document")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("not authenticated")
        }
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Not found")
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized")
        }
        const recursiveRestore = async (documentId: Id<"document">) => {
            const children = await ctx.db.query("document")
            .withIndex("by_user_parent", (q) => 
                q
                    .eq("userId", userId)
                    .eq("parentDocument", documentId)
            )
            .collect();
            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false
                })
                await recursiveRestore(child._id)
            }


        }


        const options: Partial<Doc<"document">> = {
            isArchived: false,
        }
        if (existingDocument.parentDocument) {
            const parentDocument = await ctx.db.get(existingDocument.parentDocument);
            if (parentDocument?.isArchived) {
                options.parentDocument = undefined

            }
        }
        const document = await ctx.db.patch(args.id, options);

        await recursiveRestore(args.id)

        return document;

    }
}) 

export const remove = mutation({
    args: {id: v.id('document')},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("not authenticated")
        }
        const userId = identity.subject;

        const existingDocument = await ctx.db.get(args.id);

        if (!existingDocument) {
            throw new Error("Not found")
        }

        if (existingDocument.userId !== userId) {
            throw new Error("Unauthorized")
        }

        const document = await ctx.db.delete(args.id);
        return document;

    }

})
export const getSearch = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("not authenticated")
        }
        const userId = identity.subject;

        const documents = await ctx.db
            .query("document")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order('desc')
            .collect();
        return documents;
    }
});
export const getById = query({
    args: {documentId: v.id("document")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        
        

        const document = await ctx.db.get(args.documentId);
        if (!document) {
            throw new Error('not found')
        }
        if (document.isPublished && !document.isArchived) {
            return document;
        }

        if (!identity) {
            throw new Error("not authenticated")
        }

        const userId = identity.subject;
        
        if (document.userId !== userId) {
            throw new Error("not authorized")
        }
        return document;
    }
});

export const update = mutation({
    args: {
        id: v.id("document"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),

    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        
        if (!identity) {
            throw new Error("not authenticated")
        }
        
        const {id, ...rest} = args;
        const existingDoc = await ctx.db.get(args.id);

        if (!existingDoc) {
            throw new Error("not found")
        }

        const userId = identity.subject;

        if (existingDoc.userId !== userId) {
            throw new Error("not authorized")
        }
        const updatedDoc = await ctx.db.patch(id, { ...rest });

        return updatedDoc;

    }
})
export const removeIcon = mutation({
    args: {id: v.id("document")},
    handler: async (ctx, args) => {

        const identity = await ctx.auth.getUserIdentity();
        const userId = identity?.subject;
        
        if (!identity) {
            throw new Error("not authenticated")
        }
        
        const existingDoc = await ctx.db.get(args.id);

        if (!existingDoc) {
            throw new Error("not found")
        }

        if (existingDoc.userId !== userId) {
            throw new Error("not authorized")
        }
        const document = await ctx.db.patch(args.id, {
            icon: undefined
        });
        return document

    }
});


export const removeCoverImage = mutation({
    args: {id: v.id("document")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const userId = identity?.subject;
        
        if (!identity) {
            throw new Error("not authenticated")
        }
        
        const existingDoc = await ctx.db.get(args.id);

        if (!existingDoc) {
            throw new Error("not found")
        }

        if (existingDoc.userId !== userId) {
            throw new Error("not authorized")
        }
        const document = await ctx.db.patch(args.id, {
            coverImage: undefined

        });
        return document;

    }
})