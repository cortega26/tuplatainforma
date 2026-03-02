import pathlib

# Configuración de carpetas y archivos ruidosos a ignorar
IGNORE_LIST = {
    "node_modules", "dist", "artifacts", "build", 
    "target", "__pycache__", ".venv", "venv", 
    ".git", ".astro", ".vscode", "pagefind"
}

def get_tree(path, indent="", is_last=True):
    path = pathlib.Path(path)
    
    # Filtrar: ocultos + lista de ignorados
    items = [
        f for f in path.iterdir() 
        if not f.name.startswith('.') and f.name not in IGNORE_LIST
    ]
    items.sort(key=lambda x: (x.is_file(), x.name)) # Carpetas primero, luego archivos

    tree_str = ""
    for i, item in enumerate(items):
        is_item_last = (i == len(items) - 1)
        prefix = "└── " if is_item_last else "├── "
        
        tree_str += f"{indent}{prefix}{item.name}{'/' if item.is_dir() else ''}\n"
        
        if item.is_dir():
            extension = "    " if is_item_last else "│   "
            tree_str += get_tree(item, indent + extension, is_item_last)
            
    return tree_str

def generate_ai_context(root_dir=".", output_file="project_structure.md"):
    root_path = pathlib.Path(root_dir).absolute()
    
    header = f"# Project Structure: {root_path.name}\n"
    header += "> *Nota: Se han omitido dependencias, builds y archivos de reporte para optimizar el contexto.*\n\n"
    
    tree_content = "```text\n"
    tree_content += f"{root_path.name}/\n"
    tree_content += get_tree(root_path)
    tree_content += "```\n"
    
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(header + tree_content)
    
    print(f"🚀 Estructura optimizada guardada en: {output_file}")

if __name__ == "__main__":
    generate_ai_context()